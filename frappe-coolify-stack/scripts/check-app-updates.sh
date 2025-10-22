#!/bin/bash

# Script to check if apps in apps.json have been updated
# This can be used to determine if we need to rebuild the Docker image

APPS_JSON_PATH="apps.json"
CACHE_FILE=".app-updates-cache"

# Function to get the latest commit hash for a repo
get_latest_commit() {
    local url=$1
    local branch=$2
    
    # Extract owner and repo from GitHub URL
    if [[ $url =~ github\.com/([^/]+)/([^/]+) ]]; then
        local owner=${BASH_REMATCH[1]}
        local repo=${BASH_REMATCH[2]}
        
        # Get latest commit hash from GitHub API
        local commit_hash=$(curl -s "https://api.github.com/repos/${owner}/${repo}/commits/${branch}" | jq -r '.sha' 2>/dev/null)
        
        if [ "$commit_hash" != "null" ] && [ -n "$commit_hash" ]; then
            echo "$commit_hash"
        else
            echo "unknown"
        fi
    else
        echo "unknown"
    fi
}

# Function to check if apps have been updated
check_updates() {
    local has_updates=false
    
    # Read apps.json and check each app
    while IFS= read -r line; do
        if [[ $line =~ \"url\":\ \"([^\"]+)\" ]]; then
            local url=${BASH_REMATCH[1]}
            
            # Get the branch (default to main if not specified)
            local branch="main"
            if [[ $line =~ \"branch\":\ \"([^\"]+)\" ]]; then
                branch=${BASH_REMATCH[1]}
            fi
            
            local current_commit=$(get_latest_commit "$url" "$branch")
            local cached_commit=""
            
            # Check if we have a cached version
            if [ -f "$CACHE_FILE" ]; then
                cached_commit=$(grep "${url}:${branch}" "$CACHE_FILE" | cut -d: -f3)
            fi
            
            # Update cache
            if [ -f "$CACHE_FILE" ]; then
                sed -i "/${url}:${branch}/d" "$CACHE_FILE"
            fi
            echo "${url}:${branch}:${current_commit}" >> "$CACHE_FILE"
            
            # Check if commit has changed
            if [ "$cached_commit" != "$current_commit" ] && [ -n "$cached_commit" ]; then
                echo "Update detected for $url (branch: $branch)"
                echo "  Old: $cached_commit"
                echo "  New: $current_commit"
                has_updates=true
            fi
        fi
    done < "$APPS_JSON_PATH"
    
    if [ "$has_updates" = true ]; then
        echo "Apps have been updated. Docker rebuild recommended."
        exit 1
    else
        echo "No app updates detected."
        exit 0
    fi
}

# Main execution
if [ ! -f "$APPS_JSON_PATH" ]; then
    echo "Error: $APPS_JSON_PATH not found"
    exit 1
fi

check_updates
