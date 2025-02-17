# Computer graphics 2 proyect

## Autors

- Oliver Bueno 15-10192
- José Alfonzo 17-10012
  
## Description

This project is an interactive material visualization developed with Three.js, 
featuring a variety of visual and motion effects that respond to different parameters 
and music. It uses the Web Audio API to analyze music and custom shaders in GLSL to create 
dynamic and engaging visual effects.

### Vertex Motion Material:

- Dynamic Deformation: The vertices of the material move in response to adjustable parameters, creating wave and distortion effects.
- User Interaction: Users can adjust parameters to change the intensity and style of the movements.

### Blinn-Phong Material:

-Realistic Lighting: Uses the Blinn-Phong lighting model to create specular and diffuse reflections

### Dynamic and Music-Synchronized Visualization:

- Blinn-Phong material: Uses advanced lighting to create realistic, diffuse specular reflections, synchronized to the music.
- Vertex Motion Material: The vertices of the material move according to certain adjustable parameters, creating distortion and displacement effects.

## Development environment

This project was developed using the following tech stack:

- [Node.js v23.3.0](https://nodejs.org/en)
- [Vite](https://vite.dev/)
- [Vite Plugin GLSL](https://www.npmjs.com/package/vite-plugin-glsl)
- [Three.js](https://threejs.org/)

## Link to demo video

-[Demo video](https://www.youtube.com/watch?v=TH8H2EnUlfQ)

## How to run this project

1. Download and copy this project
2. Install a compatible Node.js version (I guess any v20.10+ should suffice)
3. Run `npm install` to install the dependencies
4. Run `npm run dev` to run the Three.js project, usually on port 5173
