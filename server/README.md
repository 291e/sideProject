# Movie Community Project

## Description

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/291e/sideProject.git
    ```

2. Navigate to the project directory:

    ```bash
    cd express
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Run the application:

    ```bash
    npm start
    ```
 
OR

1. Use the dockerfile:

    ```bash
    docker build -t nodejs-server .
    ```
2. Run the postgresql DockerImage:

    ````bash
    docker run --name postgres-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres:16
    ```