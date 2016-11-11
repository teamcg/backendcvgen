CV Generator (Prototype 3)

BACK-END functionality


Nov 2<br>
-- added login, register and generate authentication code
-- added security on authentication code and student id, where if the student register successfully their profile, a value will be triggered on the AuthKey Schema, preventing other or future users to use again the same data. <br>

Nov 3 <br>
-- Major change on the folder structure. I've now created a 'routes' & 'models' folder, where i put the Schema's and models on 'models' folder, and the routes on 'routes' folder. It's much more cleaner and easy to manage and maintain <br>
-- Added security on generating authentication code to students. So it will be now 1 student id = 1 authentication code <br>
-- Added a Navigation Bar from bootstrap to let know who's the student currently logged in. and added a logout function <br>

Nov 5 <br>
-- Integrated the prototype design to the backend (Success!)
-- The only thing left was the profile page for the student
<br>

Nov 6 <br>
-- Improved version! <br>
-- successfully merged the forgot password using tokens and nodemailer into the prototype <br>
-- renaming the prototype 2 to prototype 3 <br>
-- next target, is to merge the export to Microsoft word and Download data. <br>


Nov 7 <br>
-- Successfully added the Forgot password using token, nodemailer and SendGrid as the SMTP server <br>
-- Successfully added the Generate a Microsoft Document .docx file extension. <br>
-- Added a functionality where whenever the Student registers, a new folder will be created under the CV folder with their Fullname.StudentID as the folder name. <br>
-- Successfully added download functionality for the CV <br>

Nov 9 <br>
-- Added password validation functionality


Nov 11 <br>
-- Added POST request in '/test', this is for testing purposes before merging it into the actual program <br>
-- added input field (fullname, address, mobilenumber, email and skills[array])
-- added new model 'cv'


Cheers! <br>

-John Lois Frades <br>
-CV Gen prototype