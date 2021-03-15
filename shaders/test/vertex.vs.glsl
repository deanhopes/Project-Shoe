// precision mediump float;
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// uniform vec2 uFrequency;

// uniform vec3 uDepthColor;
// uniform vec3 uSurfaceColor;
// uniform float uColorOffset;
// uniform float uColorMultiplier;

// attribute vec3 position;
// attribute float aRandom;

// varying float vRandom;

// void main()
// {
//     vec4 modelPosition = modelMatrix * vec4(position, 0.1);
//     modelPosition.z += sin(modelPosition.x * uFrequency.x) * 1.0;
//     // modelPosition.y += sin(modelPosition.y * uFrequency.y) * 1.0;
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;

//     gl_Position = projectedPosition;
//     vRandom = aRandom;
// }