```groovy
pipeline {
    agent any

    environment {
        APP_DIR = '/var/www/demo-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: install & test') {
            steps {
                dir('sample-backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate

                        pip install -r requirements.txt

                        echo "Running Django system check..."
                        python manage.py check

                        echo "Running Django tests..."
                        python manage.py test

                        deactivate
                    '''
                }
            }
        }

        stage('Frontend: install & build') {
            steps {
                dir('sample-frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    rsync -rlptD --delete \
                        --exclude ".git" \
                        --exclude "sample-backend/venv" \
                        --exclude "sample-backend/.env" \
                        --exclude "sample-frontend/.env" \
                        --exclude "sample-frontend/node_modules" \
                        ./ ${APP_DIR}/

                    cd ${APP_DIR}/sample-backend

                    . venv/bin/activate

                    pip install -r requirements.txt

                    python manage.py migrate --noinput
                    python manage.py collectstatic --noinput

                    deactivate

                    sudo systemctl restart demo-app
                    sudo systemctl reload nginx
                '''
            }
        }
    }

    post {
        success {
            echo 'Tests passed and application deployed successfully.'
        }

        failure {
            echo 'Build, test, or deployment failed — check the stage logs above.'
        }
    }
}
```
