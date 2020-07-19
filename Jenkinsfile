#!/usr/bin/env groovy
    import java.util.Date
    import groovy.json.*
    def repoName = 'Rest-API-for-Davids-Laundromat-Service'
    def projectName = 'global'
    def deploymentName = 'laundromat-backend'
    def awsEcrAccount = '247873396279.dkr.ecr.eu-west-1.amazonaws.com'

    def isMaster = env.BRANCH_NAME == 'master'
    def isStaging = env.BRANCH_NAME == 'staging'
    def start = new Date()
    def err = null
    def jobInfo = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME} \n${env.BUILD_URL}"
    def imageTag = "${env.BUILD_NUMBER}"
    String jobInfoShort = "${env.JOB_NAME} ${env.BUILD_DISPLAY_NAME}"
    String buildStatus
    String timeSpent
    currentBuild.result = "SUCCESS"
    try {
        node {
            deleteDir()
            stage('initializing'){
                slackSend (color: 'good', message: "Initializing build process for `${repoName}` ...")
            }

            stage ('Checkout') {
                checkout scm
                slackSend (color: 'good', message: "Successfully  Pulled `${repoName}` ...")
            }

            stage('Stop Running container'){

            }

            stage('build docker image'){
                sh "docker build -t ${deploymentName} ."
                sh("docker tag laundromat-backend:latest ${awsEcrAccount}/${deploymentName}:latest")

                slackSend (color: 'good', message: "Built ang tagged Docker image for `${repoName}` ...")
            }


    //     stage ('Push Docker to AWS ECR') {
    //             sh "\$(aws ecr get-login --no-include-email --region ${AWS_ECR_REGION})"
    //             sh "docker build -t ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${imageTag} ."
    //             pushImage(repoName, projectName, imageTag)
    //             slackSend (color: 'good', message: "docker image on `${env.BRANCH_NAME}` branch in `${repoName}` pushed to *_AWS ECR_*")
    //         }
    //     if(isMaster || isStaging){
    //             stage ('Deploy to Kubernetes') {
    //                 deploy(deploymentName, imageTag, projectName,repoName, isMaster)
    //                 slackSend (color: 'good', message: ":fire: Nice work! `${repoName}` deployed to *_Kubernetes_*")
    //             }
    //     }
    //     stage('Clean up'){
    //                 sh "docker rmi ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${imageTag}"
    //         }
    //     }
        }
    } catch (caughtError) {
        err = caughtError
        currentBuild.result = "FAILURE"
    } finally {
        timeSpent = "\nTime spent: ${timeDiff(start)}"
        if (err) {
            slackSend (color: 'danger', message: ":disappointed: _Build failed_: ${jobInfo} ${timeSpent} ${err}")
        } else {
            if (currentBuild.previousBuild == null) {
                buildStatus = '_First time build_'
            } else if (currentBuild.previousBuild.result == 'SUCCESS') {
                buildStatus = '_Build complete_'
            } else {
                buildStatus = '_Back to normal_'
            }

            slackSend (color: 'good', message: ":fire: Nice work! `${repoName}` deployed to *_Server_*")

        }
    }

        def timeDiff(st) {
        def delta = (new Date()).getTime() - st.getTime()
        def seconds = delta.intdiv(1000) % 60
        def minutes = delta.intdiv(60 * 1000) % 60
        return "${minutes} min ${seconds} sec"
    }
    