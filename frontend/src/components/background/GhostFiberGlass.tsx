import GhostFibers from "../GhostFibers";

function GhostFiberGlass() {
  return (
    <div className="absolute inset-0">
      <GhostFibers
        lineColor="#140E35"
        glowColor="#3437A0"
        speed={0.2}
        scale={2}
        rotation={0}
        rotationSpeed={0.25}
        layers={4}
        waveAmplitude={0.015}
        waveFrequency={3}
        waveSpeed={0.15}
        layerSpeed={0.08}
        twist={0.1}
        twistFrequency={5}
        twistSpeed={1.2}
        lineFrequency={5}
        lineSpacing={2}
        lineSharpness={16}
        glowFalloff={10}
        glowIntensity={1.6}
        brightness={2}
        blueBoost={1.25}
        vignette={0.8}
        grain={0.05}
        dpr={1}
        lightMode={false}
        fps={60}
        paused={false}
      />
    </div>
  );
}

export default GhostFiberGlass;