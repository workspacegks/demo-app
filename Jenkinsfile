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
                        set -e

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
                        set -e

                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -e

                    echo "Deploying application..."

                    rsync -rlptD --delete \
                        --exclude ".git" \
                        --exclude "sample-backend/venv" \
                        --exclude "sample-backend/.env" \
                        --exclude "sample-frontend/.env" \
                        --exclude "sample-frontend/node_modules" \
                        ./ ${APP_DIR}/

                    cd ${APP_DIR}/sample-backend

                    . venv/bin/activate

                    echo "Installing backend dependencies..."
                    pip install -r requirements.txt

                    echo "Applying database migrations..."
                    python manage.py migrate --noinput

                    echo "Collecting static files..."
                    python manage.py collectstatic --noinput

                    deactivate

                    echo "Restarting Gunicorn..."
                    sudo systemctl restart demo-app

                    echo "Reloading Nginx..."
                    sudo systemctl reload nginx

                    echo "Deployment completed successfully."
                '''
            }
        }
    }

    post {
        success {
            echo 'Build, tests, frontend build, migration, and deployment completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}