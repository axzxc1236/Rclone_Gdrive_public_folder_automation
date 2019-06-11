# Rclone Gdrive public folder automation

## Why this is created
I need to copy many publically shared Google Drive folder with rclone, you might know there is a copy function on Google Drive webpage, why not use that?
1. I might want to copy these folders to my computer.
2. I might want to copy these folders to my Google Drive but encrypted.
3. I might want to copy these folders to another cloud storage providers. (for example Dropbox, FTP Server...)

## How to use it?
1. Install [Node.js](https://nodejs.org/en/download/)
2. replace rclone.conf file with working one. (use "rclone config file" command to find where it's located.)
3. Make sure rclone.conf starts with a drive remote, or at least conrains a drive remote, with a working token.
4. modify filelist.txt with following format (can be a multiline file)
> (public folder ID)===(destination)

> for example [https://drive.google.com/drive/folders/1N7rmP_1y4eo8bc75muJQPHXss-GgR1ja](https://drive.google.com/drive/folders/1N7rmP_1y4eo8bc75muJQPHXss-GgR1ja) has the folder ID 1N7rmP_1y4eo8bc75muJQPHXss-GgR1ja
> 
> (If you are wondering what is the file I linked, it's [a known troll file](https://www.reddit.com/r/DHExchange/comments/ax4or0/psa_beware_of_this_individual_who_claims_to_have/) contains all the Rick rolls you need.)

> destination can be whatever file path you put into rclone, like "encrypted:Rick roll troll" (encrypted remote must be in rclone.conf you provided for that to work) or just "Rick roll troll", **It doesn't need to have double quotes even if the path contains whitespace** (at least on Windows 10), it looks like Node.JS adds double quotes itself.

5. After you configured correctly, run "node app.js" and see if it works.

## Note

If you don't have rclone(.exe) in your path environment variable, you need to change "rcloneCommand" in app.js to something like "C:/rclone/rclone.exe" or wherever rclone is located.

**Sometimes you will get error messages in rclone and.... it might be fine**, there is [a issue that requires better fix but now have workaround](https://github.com/axzxc1236/Rclone_Gdrive_public_folder_automation/issues/1).