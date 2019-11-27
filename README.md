# ATM-Website
School project to set up a basic banking interface and backend

## How to pull from github
#### Windows
Chocolatey is a windows based package manager used for installing software through the command line.

To install chocolatey open a elevated command prompt and run this command.
```
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
```

Once chocolatey is installed we need to refresh the cmd environment.
```
refreshenv
```

Now that we have refreshed our path we have to install the git client.
```
choco install git
```

be sure to refresh your environment again.

Now lastly navigate to the directory you want to save the files to in the command prompt.

Use this command to clone the repository to it.
```
git clone https://github.com/cmpe131-prog/ATM-Website.git
```

## How to setup and start webserver
Okay this one is a little bit more complicated. I am going to assume you have already installed chocolatey
#### Install python
First we need to install python as the web-server is based on a python backend
This should also install pip which will be required later
```
choco install python
```

refresh your environment
#### Install virtualenvwrapper-win
We need this to create a virtual environment to run everything in.
```
pip install virtualenvwrapper-win
```

refresh your environment
#### Create and set up the virtual environment
```
mkvirtualenv dank_bank
```

then whenever you will run any of the code for the backend use this command to use the environment
```
workon dank_bank
```

navigate in to the project directory and run the setup file. This sets up and installs all the required packages for the python virtual environment
```
pip install -e .
```

#### Starting the webserver
everything should already be packaged up nicely to be run by one file
```
python app.py
```

the server should be running now! Test out some of the example pages to see how to use the api!

## MacOSX
If you are on mac. Check out the package manager [Homebrew](https://brew.sh/).

Here is a [link](https://swapps.com/blog/how-to-configure-virtualenvwrapper-with-python3-in-osx-mojave/) that shows how to set up python and virtualenvwrapper on your mac.

Go to "Create and set up the virtual environment" in the windows section to finish and launch webserver.