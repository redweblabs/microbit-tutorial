# Micro:bit music tutorial


## Intro

Using 4 micro:bits we can create an interactive music experience.

Each micro:bit wristband controls the volume of a particular instrument depending on the intensity of movement detected by the magnetometer. The playback speed is controlled by the average movement of all 4 micro:bit wristbands.

### Requirements:
- 4 micro:bits
- 4 micro:bit battery packs
- 1 Micro USB cable
- Basic command line knowledge.

## Installation

This tutorial requires Node JS to run. You can find instructions on how to install Node JS [here](https://nodejs.org/en/download/)

Using the command line, navigate to the location of the code and run `npm install`. This will now install a few modules that our code need to run.

Installing the modules will create a folder in our project called `/node_modules`. Navigate to the folder called `/node_modules/bbc-microbit/firmware` folder. The hex file in here will need to be transferred to each micro:bit via USB cable before we continue.

## Identify Devices

Now we will need to discover the ID codes of the four micro:bits that will be used for the project.

To do this, run the command `node discover.js`. Make sure your bluetooth is on, and all four devices are switched on. With luck 4 devices will be detected and their IDs logged for you.

Now copy open a code editor and edit the `main.js` file. At the bottom of the code there will be four lines that you will need to copy the ID code into for each into.

## Run code

Once you have done that, run `node main.js` and open a web browser. Navigate to `http://localhost:3000` to check if everything is working! You may need to calibrate the magnetometer by moving it in a circle beforehand.

## Experiment

If you want to look deeper into how the project works or want to tweak it a bit, try reading the code and changing bits of it.
