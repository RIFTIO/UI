pipeline {
	agent any
	stages {
		stage("Build") {
			agent {
				dockerfile true
			}
			steps {
				sh 'make NOT_DEVELOPER_BUILD=TRUE -j16 package'
				stash name: "deb-files", includes: ".build/*.deb"
			}
		}
		stage("Repo Component") {
			steps {
				unstash "deb-files"
				sh '''
					mkdir -p pool/UI
					mv .build/*.deb pool/UI/
					mkdir -p dists/$RELEASE/UI/binary-amd64
					apt-ftparchive packages pool/UI > dists/$RELEASE/UI/binary-amd64/Packages
					gzip -9fk dists/$RELEASE/UI/binary-amd64/Packages
					'''
				archiveArtifacts artifacts: "dists/**,pool/UI/*.deb"
			}
		}
	}
}
