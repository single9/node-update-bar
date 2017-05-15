#!/bin/bash -e
set -e

NPM=npm
NODE=node

updateNodeModules() {
    safeInstall(){
        total=$("$NODE" -e 'console.log(Object.keys(require("./package.json").dependencies).length)');
        deps=$("$NODE" -e 'console.log(Object.keys(require("./package.json").dependencies).join(" "))');
        i=1
        for m in ${deps[@]}; do 
            echo "{\"item\": $i, \"name\": \"$m\", \"total\": $total}"
            "$NPM" install --loglevel error "$m" &> /dev/null
            i=$(($i + 1))
        done
    }
    safeInstall
}

updateNodeModules