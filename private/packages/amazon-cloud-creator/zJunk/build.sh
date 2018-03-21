#!/bin/bash -eu

F=FooFunction.zip
if [ -f "$F" ]; then rm "$F"; fi
cd FooFunction; zip -r ../FooFunction.zip *; cd ..;

Version=$(md5sum -b FooFunction.zip | awk '{print $1}')
echo $Version

aws s3 cp FooFunction.zip s3://$S3_BUCKET_NAME/FooFunction-$Version.zip
aws s3 cp FooFunction.zip s3://$S3_BUCKET_NAME/FooFunction-latest.zip
