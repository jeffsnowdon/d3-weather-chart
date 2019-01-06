node {
    stage 'checkout'
    checkout scm

    stage 'npm install'
    sh "npm install"

    stage 'frontend build'
    sh "gulp build"
}