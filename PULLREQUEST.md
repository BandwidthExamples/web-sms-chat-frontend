# How to Submit a Pull Request

* Search through Bandwidth's open and closed pull request to ensure you are not submitting something that has already been submitted.
* Make all necessary changes in a new git branch:
    ```shell
    git checkout -b new-fixed-branch
    ```
* Make all necessary changes to the code
* Test your changes before committing the code
* Add the changes to be committed
    ```shell
    git add
    ```
* Commit the changes you have made with a descriptive commit message
    ```shell
    git commit -m "add description here"
    ```
* Push your changes to Github
    ```shell
    git push
    ```
* Open a pull request in Github

If we ask you to make any necessary changes:

* Make the required changes on your branch
* Test the changes to make sure the code works
* Add and commit the changes
* Push your changes to Github. This will automatically update the pull request.

After the your branch has been merged, please delete your branch.