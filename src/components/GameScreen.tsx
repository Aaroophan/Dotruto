import React, { useEffect, useRef, useState } from 'react';
import { Engine, Render, World, Bodies, Body, Events, Runner } from 'matter-js';
import { Player } from './entities/Player';
import { Clone } from './entities/Clone';
import { Platform } from './entities/Platform';
import { Enemy } from './entities/Enemy';
import { ChakraScroll } from './entities/ChakraScroll';
import { GameHUD } from './ui/GameHUD';
import { PauseMenu } from './ui/PauseMenu';
import { useGameContext } from '../context/GameContext';
import { useKeyControls } from '../hooks/useKeyControls';
import { useGameAudio } from '../hooks/useGameAudio';

interface GameScreenProps {
  onGameOver: (score: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const playerRef = useRef<Matter.Body | null>(null);
  const clonesRef = useRef<{ body: Matter.Body; createdAt: number; expiresAt: number }[]>([]);
  const platformsRef = useRef<Matter.Body[]>([]);
  const enemiesRef = useRef<Matter.Body[]>([]);
  const scrollsRef = useRef<Matter.Body[]>([]);
  const inputHistoryRef = useRef<{ time: number; action: { x: number; y: number } }[]>([]);
  
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const { score, lives, paused, addScore, removeLife, resetGame, togglePause } = useGameContext();
  const { playSound, toggleBgMusic } = useGameAudio();
  
  // Setup key controls
  const { keys, clearKeys } = useKeyControls({
    onPause: () => togglePause(),
    onClone: () => createClone(),
  });

  // Handle game over
  useEffect(() => {
    if (lives <= 0) {
      onGameOver(score);
    }
  }, [lives, score, onGameOver]);

  // Handle pause state
  useEffect(() => {
    if (runnerRef.current) {
      if (paused) {
        Runner.stop(runnerRef.current);
        toggleBgMusic(false);
      } else {
        Runner.start(runnerRef.current, engineRef.current!);
        toggleBgMusic(true);
      }
    }
  }, [paused, toggleBgMusic]);

  // Initialize physics engine
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Set canvas size based on window
    const updateCanvasSize = () => {
      setCanvasSize({
        width: Math.min(window.innerWidth, 1200),
        height: Math.min(window.innerHeight, 800),
      });
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 0.5 },
    });
    engineRef.current = engine;
    
    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasSize.width,
        height: canvasSize.height,
        wireframes: false,
        background: '#111827',
      },
    });
    renderRef.current = render;
    
    // Create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    
    // Create player
    createPlayer();
    
    // Create initial platforms
    createInitialPlatforms();
    
    // Start the engine and renderer
    Render.run(render);
    Runner.run(runner, engine);
    
    // Setup collision events
    setupCollisions();
    
    // Game loop for spawning elements and checking bounds
    const gameLoopInterval = setInterval(() => {
      if (paused) return;
      
      // Record player input for clones
      if (playerRef.current) {
        inputHistoryRef.current.push({
          time: Date.now(),
          action: { x: keys.left ? -1 : keys.right ? 1 : 0, y: keys.jump ? -1 : 0 },
        });
        
        // Keep only last 5 seconds of inputs
        const fiveSecondsAgo = Date.now() - 5000;
        inputHistoryRef.current = inputHistoryRef.current.filter(
          (input) => input.time > fiveSecondsAgo
        );
      }
      
      // Update clones based on recorded input
      updateClones();
      
      // Check if player is out of bounds
      checkBounds();
      
      // Randomly spawn enemies and scrolls
      if (Math.random() < 0.02) spawnEnemy();
      if (Math.random() < 0.03) spawnChakraScroll();
      
      // Clean up expired clones
      cleanupExpiredClones();
      
    }, 16); // Approximately 60 FPS
    
    // Cleanup
    return () => {
      clearInterval(gameLoopInterval);
      window.removeEventListener('resize', updateCanvasSize);
      
      if (renderRef.current) Render.stop(renderRef.current);
      if (runnerRef.current) Runner.stop(runnerRef.current);
      if (engineRef.current) World.clear(engineRef.current.world, false);
      
      clearKeys();
    };
  }, [canvasSize.width, canvasSize.height]);

  // Setup collision detection
  const setupCollisions = () => {
    if (!engineRef.current) return;
    
    Events.on(engineRef.current, 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        
        // Player collides with platform
        if (
          (bodyA === playerRef.current && bodyB.label.includes('platform')) ||
          (bodyB === playerRef.current && bodyA.label.includes('platform'))
        ) {
          playSound('bounce');
        }
        
        // Player collides with enemy
        if (
          (bodyA === playerRef.current && bodyB.label.includes('enemy')) ||
          (bodyB === playerRef.current && bodyA.label.includes('enemy'))
        ) {
          removeLife();
          playSound('hit');
          
          // Remove the enemy
          const enemy = bodyA.label.includes('enemy') ? bodyA : bodyB;
          if (engineRef.current) World.remove(engineRef.current.world, enemy);
          enemiesRef.current = enemiesRef.current.filter((e) => e !== enemy);
        }
        
        // Player collides with scroll
        if (
          (bodyA === playerRef.current && bodyB.label.includes('scroll')) ||
          (bodyB === playerRef.current && bodyA.label.includes('scroll'))
        ) {
          const scroll = bodyA.label.includes('scroll') ? bodyA : bodyB;
          addScore(10);
          playSound('collect');
          
          // Remove the scroll
          if (engineRef.current) World.remove(engineRef.current.world, scroll);
          scrollsRef.current = scrollsRef.current.filter((s) => s !== scroll);
        }
        
        // Clone collides with enemy
        const cloneBody = clonesRef.current.find(
          (c) => c.body === bodyA || c.body === bodyB
        )?.body;
        
        if (cloneBody) {
          const otherBody = cloneBody === bodyA ? bodyB : bodyA;
          
          if (otherBody.label.includes('enemy')) {
            addScore(5);
            playSound('enemyDefeat');
            
            // Remove the enemy
            if (engineRef.current) World.remove(engineRef.current.world, otherBody);
            enemiesRef.current = enemiesRef.current.filter((e) => e !== otherBody);
          }
          
          if (otherBody.label.includes('scroll')) {
            addScore(5);
            playSound('collect');
            
            // Remove the scroll
            if (engineRef.current) World.remove(engineRef.current.world, otherBody);
            scrollsRef.current = scrollsRef.current.filter((s) => s !== otherBody);
          }
        }
      }
    });
  };

  // Create player
  const createPlayer = () => {
    if (!engineRef.current) return;
    
    const player = Bodies.circle(
      canvasSize.width / 2,
      canvasSize.height / 2,
      15,
      {
        label: 'player',
        density: 0.002,
        friction: 0.1,
        frictionAir: 0.01,
        restitution: 0.8,
        render: {
          fillStyle: '#f97316',
          strokeStyle: '#fdba74',
          lineWidth: 2,
        },
      }
    );
    
    World.add(engineRef.current.world, player);
    playerRef.current = player;
  };

  // Create initial platforms
  const createInitialPlatforms = () => {
    if (!engineRef.current) return;
    
    // Bottom platform
    const ground = Bodies.rectangle(
      canvasSize.width / 2,
      canvasSize.height - 20,
      canvasSize.width,
      20,
      {
        label: 'platform_ground',
        isStatic: true,
        render: {
          fillStyle: '#3b82f6',
          strokeStyle: '#60a5fa',
          lineWidth: 1,
        },
      }
    );
    
    // Add some floating platforms
    const platform1 = Bodies.rectangle(
      canvasSize.width / 4,
      canvasSize.height - 120,
      200,
      15,
      {
        label: 'platform_1',
        isStatic: true,
        render: {
          fillStyle: '#3b82f6',
          strokeStyle: '#60a5fa',
          lineWidth: 1,
        },
      }
    );
    
    const platform2 = Bodies.rectangle(
      canvasSize.width * 0.75,
      canvasSize.height - 220,
      200,
      15,
      {
        label: 'platform_2',
        isStatic: true,
        render: {
          fillStyle: '#3b82f6',
          strokeStyle: '#60a5fa',
          lineWidth: 1,
        },
      }
    );
    
    const platform3 = Bodies.rectangle(
      canvasSize.width / 2,
      canvasSize.height - 320,
      150,
      15,
      {
        label: 'platform_3',
        isStatic: true,
        render: {
          fillStyle: '#3b82f6',
          strokeStyle: '#60a5fa',
          lineWidth: 1,
        },
      }
    );
    
    World.add(engineRef.current.world, [ground, platform1, platform2, platform3]);
    platformsRef.current = [ground, platform1, platform2, platform3];
  };

  // Create a clone
  const createClone = () => {
    if (!playerRef.current || !engineRef.current) return;
    
    playSound('clone');
    
    const cloneX = playerRef.current.position.x;
    const cloneY = playerRef.current.position.y;
    
    const clone = Bodies.circle(cloneX, cloneY, 15, {
      label: 'clone_' + Date.now(),
      density: 0.002,
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.8,
      render: {
        fillStyle: 'rgba(249, 115, 22, 0.7)',
        strokeStyle: '#fdba74',
        lineWidth: 1,
      },
    });
    
    World.add(engineRef.current.world, clone);
    
    // Add to clones list with creation time and expiration time
    const now = Date.now();
    clonesRef.current.push({
      body: clone,
      createdAt: now,
      expiresAt: now + 5000, // Clones last 5 seconds
    });
  };

  // Update clones based on recorded input history
  const updateClones = () => {
    if (!engineRef.current) return;
    
    clonesRef.current.forEach((clone) => {
      // Find the input from 1 second ago (1000ms)
      const inputTime = Date.now() - 1000;
      const closestInput = inputHistoryRef.current
        .filter((input) => input.time <= inputTime)
        .sort((a, b) => b.time - a.time)[0];
      
      if (closestInput && clone.body) {
        const force = { x: closestInput.action.x * 0.005, y: 0 };
        Body.applyForce(clone.body, clone.body.position, force);
        
        if (closestInput.action.y < 0) {
          // Jump/bounce action for clone
          const isOnPlatform = platformsRef.current.some((platform) => {
            const platformY = platform.position.y - platform.bounds.max.y + platform.bounds.min.y;
            const cloneBottom = clone.body.position.y + 15;
            const xDiff = Math.abs(platform.position.x - clone.body.position.x);
            const platformWidth = platform.bounds.max.x - platform.bounds.min.x;
            
            return (
              cloneBottom >= platformY - 5 &&
              cloneBottom <= platformY + 5 &&
              xDiff < platformWidth / 2
            );
          });
          
          if (isOnPlatform) {
            Body.setVelocity(clone.body, { x: clone.body.velocity.x, y: -7 });
          }
        }
      }
    });
  };

  // Spawn enemies
  const spawnEnemy = () => {
    if (!engineRef.current) return;
    
    const enemyX = Math.random() * canvasSize.width;
    const enemyY = 0;
    
    const enemy = Bodies.polygon(enemyX, enemyY, 3, 15, {
      label: 'enemy_' + Date.now(),
      density: 0.001,
      friction: 0.01,
      frictionAir: 0.001,
      restitution: 1,
      render: {
        fillStyle: '#a855f7',
        strokeStyle: '#c4b5fd',
        lineWidth: 1,
      },
    });
    
    // Give it some initial velocity
    Body.setVelocity(enemy, {
      x: (Math.random() - 0.5) * 5,
      y: Math.random() * 2 + 1,
    });
    
    World.add(engineRef.current.world, enemy);
    enemiesRef.current.push(enemy);
  };

  // Spawn chakra scrolls
  const spawnChakraScroll = () => {
    if (!engineRef.current) return;
    
    const scrollX = Math.random() * canvasSize.width;
    const scrollY = Math.random() * (canvasSize.height / 2);
    
    const scroll = Bodies.circle(scrollX, scrollY, 10, {
      label: 'scroll_' + Date.now(),
      density: 0.001,
      friction: 0.01,
      frictionAir: 0.001,
      restitution: 0.8,
      render: {
        fillStyle: '#22c55e',
        strokeStyle: '#86efac',
        lineWidth: 2,
      },
    });
    
    World.add(engineRef.current.world, scroll);
    scrollsRef.current.push(scroll);
  };

  // Check if player is out of bounds and handle game boundaries
  const checkBounds = () => {
    if (!playerRef.current || !engineRef.current) return;
    
    const { x, y } = playerRef.current.position;
    
    // Wrap horizontally
    if (x < 0) Body.setPosition(playerRef.current, { x: canvasSize.width, y });
    if (x > canvasSize.width) Body.setPosition(playerRef.current, { x: 0, y });
    
    // If player falls below the bottom of the screen
    if (y > canvasSize.height + 50) {
      removeLife();
      playSound('fall');
      
      // Reset player position
      Body.setPosition(playerRef.current, {
        x: canvasSize.width / 2,
        y: canvasSize.height / 2,
      });
      Body.setVelocity(playerRef.current, { x: 0, y: 0 });
    }
  };

  // Clean up expired clones
  const cleanupExpiredClones = () => {
    if (!engineRef.current) return;
    
    const now = Date.now();
    const expiredClones = clonesRef.current.filter((clone) => clone.expiresAt <= now);
    
    expiredClones.forEach((clone) => {
      World.remove(engineRef.current!.world, clone.body);
    });
    
    clonesRef.current = clonesRef.current.filter((clone) => clone.expiresAt > now);
  };

  // Apply forces to player based on key controls
  useEffect(() => {
    if (!playerRef.current || paused) return;
    
    const force = { x: 0, y: 0 };
    
    if (keys.left) force.x = -0.001;
    if (keys.right) force.x = 0.001;
    
    if (Object.values(force).some((v) => v !== 0)) {
      Body.applyForce(playerRef.current, playerRef.current.position, force);
    }
    
    if (keys.jump) {
      // Check if player is on a platform before allowing jump
      const isOnPlatform = platformsRef.current.some((platform) => {
        const platformY = platform.position.y - platform.bounds.max.y + platform.bounds.min.y;
        const playerBottom = playerRef.current!.position.y + 15;
        const xDiff = Math.abs(platform.position.x - playerRef.current!.position.x);
        const platformWidth = platform.bounds.max.x - platform.bounds.min.x;
        
        return (
          playerBottom >= platformY - 5 &&
          playerBottom <= platformY + 5 &&
          xDiff < platformWidth / 2
        );
      });
      
      if (isOnPlatform) {
        Body.setVelocity(playerRef.current, {
          x: playerRef.current.velocity.x,
          y: -10,
        });
        playSound('jump');
      }
    }
  }, [keys, paused]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      
      <GameHUD />
      
      {paused && <PauseMenu onResume={togglePause} />}
    </div>
  );
};