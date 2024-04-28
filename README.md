<p align="center">
    Anime Art Generator 
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

This is a project to allows users generate anime art images using a based stable diffusion model.

## Features

- Generate anime art images using a based stable diffusion model using Replicate API
- User registration using email/password authentication with header jwt token.
- Password reset using email verification.
- Serverless API using AWS Lambda & API Gateway
- Tests for the API using Vitest
- Automated deployment of the API using AWS Github Actions & Serverless Framework
- Queued image generation using AWS SQS
- Real-time image generation status updates using AWS websocket API Gateway
- Payment processing using Stripe API.

## Technologies

- Next.js
- Node.js
- TypeScript
- Jwt
- Vitest (Testing Framework)
- Drizzle (Lightweight ORM)
- AWS Lambda, API Gateway, SQS, DynamoDB & Websocket API Gateway
- Serverless Framework (Deployment)
- Stripe API (Payment Processing)
- Replicate API (Anime Art Generation)

## Installation

- Clone the repository
- Install the app dependencies using `pnpm install` in the app directory
- Install the api dependencies using `pnpm install` in the api directory

## Usage

- Copy the .env.example file as .env in the api directory and add the required environment variables
- Start the app using `pnpm dev` in the app directory
- Copy the .env.example file as .env in the app directory and add the required environment variables
- Start the api using `pnpm dev` in the api directory
- Run the tests using `pnpm test` in the api directory
- Add secrets to Github repository for deployment using Github Actions & Serverless Framework (AWS)

## License

[MIT](https://choosealicense.com/licenses/mit/)
