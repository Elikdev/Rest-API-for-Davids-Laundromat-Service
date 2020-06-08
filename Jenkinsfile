#!/usr/bin/env groovy
    import java.util.Date
    import groovy.json.*
    def repoName = 'Rest-API-for-Davids-Laundromat-Service'
    def projectName = 'global'
    def deploymentName = 'Laundromart Service'

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
            slackSend (color: 'good', message: "${jobInfo}: ${timeSpent}")
        }
    }
    // def deploy(deploymentName, imageTag, projectName,repoName, isMaster){
    //     def namespace = isMaster ? "production" : "staging"
    //     sh("sed -i.bak 's|${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:latest|${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${env.BUILD_NUMBER}|' ./kubernetes/decryption-portal-backend-deployment.yml")
    //     try{
    //         sh "kubectl apply --namespace=${namespace}  -f kubernetes/ --context i-040acc9d4cf316c92@k8scluster.us-west-2.eksctl.io"
    //     }
    //     catch (err) {
    //         slackSend (color: 'danger', message: ":disappointed: _Build failed_: ${jobInfo} ${err}")
    //     }
     }

    def pushImage(repoName, projectName, imageTag){
        try{
            sh "docker push ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${imageTag}"
        }catch(e){
            sh "aws ecr create-repository --repository-name ${projectName}/${repoName} --region ${AWS_ECR_REGION}"
            sh "aws ecr set-repository-policy --repository-name ${projectName}/${repoName} --policy-text file://policy.json --region ${AWS_ECR_REGION}"
            sh "docker push ${AWS_ECR_ACCOUNT}/${projectName}/${repoName}:${imageTag}"
        }
    }

    def timeDiff(st) {
        def delta = (new Date()).getTime() - st.getTime()
        def seconds = delta.intdiv(1000) % 60
        def minutes = delta.intdiv(60 * 1000) % 60
        return "${minutes} min ${seconds} sec"
    }
        
    