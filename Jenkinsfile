pipeline {

    agent {
        docker { image 'node:7-alpine' }
    }

    stages {
         stage('Build') {
            steps {
                echo 'Building..'
                checkout scm
                echo 'after checkout..'
                sh 'npm config ls'
                echo 'after npm ls'
                sh 'npm install'
                echo 'after npm install'
                sh 'gulp build'
                echo 'after gulp build'
            }
        }
  agent any
  stages {
    stage('Build') {
      steps {
        echo 'Building..'
        checkout scm
        echo 'after checkout..'
        sh 'npm --version'
        echo 'after npm install'
      }
    }
	}
  
}