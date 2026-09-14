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

                        echo "Checking for missing migrations..."
                        python manage.py makemigrations --check --dry-run

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

                    echo "Applying database migrations..."
                    python manage.py migrate --noinput

                    echo "Collecting static files..."
                    python manage.py collectstatic --noinput

                    deactivate

                    echo "Restarting Gunicorn..."
                    sudo systemctl restart demo-app

                    echo "Reloading Nginx..."
                    sudo systemctl reload nginx
                '''
            }
        }
    }

    post {
        success {
            echo 'Migration check, tests, build, and deployment completed successfully.'
        }

        failure {
            echo 'Pipeline failed — check the stage logs above.'
        }
    }
}