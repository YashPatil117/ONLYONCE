pipeline {
    agent any

    tools {
        maven 'M3'   // use the Maven installation configured in Jenkins
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building project...'
                bat 'mvn clean package'    // ✅ Use bat for Windows
            }
        }

        stage('Deploy to Tomcat') {
            steps {
                echo 'Deploying WAR to Tomcat...'
                deploy adapters: [
                    tomcat9(
                        credentialsId: 'tomcat-credentials',
                        path: '',
                        url: 'http://localhost:8080/'
                    )
                ], contextPath: 'onlyonce', war: 'target/onlyonce.war'
            }
        }
    }

    post {
        success {
            echo '✅ Build and deploy successful!'
        }
        failure {
            echo '❌ Build or deploy failed.'
        }
    }
}
