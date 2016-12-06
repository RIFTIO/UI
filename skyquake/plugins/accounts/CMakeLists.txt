# 
#   Copyright 2016 RIFT.IO Inc
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# Author(s): Kiran Kashalkar
# Creation Date: 08/18/2015
# 

##
# DEPENDENCY ALERT
# The submodule dependencies must be specified in the
# .gitmodules.dep file at the top level (supermodule) directory
# If this submodule depends other submodules remember to update
# the .gitmodules.dep
##

cmake_minimum_required(VERSION 2.8)

##
# Submodule specific includes will go here,
# These are specified here, since these variables are accessed
# from multiple sub directories. If the variable is subdirectory
# specific it must be declared in the subdirectory.
##

rift_externalproject_add(
  accounts
  DEPENDS skyquake
  SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}
  CONFIGURE_COMMAND echo
  BUILD_COMMAND
    ${CMAKE_CURRENT_BINARY_DIR}/accounts/accounts-build/scripts/build.sh
  INSTALL_COMMAND
    ${CMAKE_CURRENT_SOURCE_DIR}/scripts/install.sh
    ${CMAKE_CURRENT_BINARY_DIR}/accounts/accounts-build
    ${CMAKE_INSTALL_PREFIX}/usr/share/rw.ui/skyquake
    ${RIFT_SUBMODULE_INSTALL_PREFIX}/skyquake/${CMAKE_INSTALL_PREFIX}/usr/share/rw.ui/skyquake

  BCACHE_COMMAND echo
)

