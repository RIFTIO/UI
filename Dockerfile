FROM ubuntu:16.04

RUN apt-get update && apt-get -y install python3 curl build-essential
RUN curl http://repos.riftio.com/public/xenial-riftware-public-key | apt-key add - && \
	curl -o /etc/apt/sources.list.d/OSM.list http://buildtracker.riftio.com/repo_file/ub16/OSM/ && \
	apt-get update && \
	apt-get -y install rw.toolchain-rwbase \
		rw.toolchain-rwtoolchain \
		rw.core.mgmt-mgmt \
		rw.core.util-util \
		rw.core.rwvx-rwvx \
		rw.core.rwvx-rwdts \
		rw.automation.core-RWAUTO \
		rw.tools-container-tools \
		rw.tools-scripts \
		python-cinderclient \
		libxml2-dev \
		libxslt-dev

RUN /usr/rift/container_tools/mkcontainer --modes build --modes ext --repo OSM

RUN chmod 777 /usr/rift /usr/rift/usr/share

RUN rm -rf /tmp/npm-cache
