import 'package:app/email.dart';
import 'package:flutter/material.dart';
// import 'package:http/http.dart' as http;
// import 'dart:async';
// import 'dart:convert';
import 'api.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  RegisterScreenState createState() => RegisterScreenState();
}

const String url = "https://progress-tracker-4331-88c53c23c126.herokuapp.com";

var num = 0;

// Future<void> registerUser(
//     String firstName, String lastName, String login, String password) async {
//   Map data = {
//     "first name": firstName,
//     "last name": lastName,
//     "username": login,
//     "password": password
//   };
//   var jsonData = jsonEncode(data);
//   var response = await http.post(Uri.parse("$url/api/register"),
//       body: jsonData, headers: {'Content-type': 'application/json'});
//   print(response.statusCode);
//   print(response.body);
//   if (response.statusCode == 200) {
//     print(data);
//     print('Register successful');
//     num = 1;
//   } else {
//     print('failed');
//     num = 0;
//   }
// }

//  VerifyEmail(email) {
//     const emailRegex = "/^\S+@\S+\.\S+$/";
//     return emailRegex.test(email);
//   }

class RegisterScreenState extends State<RegisterScreen> {
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();
  TextEditingController userNameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dare2Do Register'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              controller: firstNameController,
              decoration: InputDecoration(hintText: 'First Name'),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: lastNameController,
              decoration: InputDecoration(hintText: 'Last Name'),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: userNameController,
              decoration: InputDecoration(hintText: 'Username'),
            ),
            SizedBox(height: 20),
            TextFormField(
              controller: emailController,
              decoration: InputDecoration(hintText: 'Email'),
            ),
            SizedBox(height: 20),
            TextFormField(
                controller: passwordController,
                obscureText: true,
                decoration: InputDecoration(hintText: 'Password')),
            SizedBox(height: 40),
            GestureDetector(
              onTap: () async {
                final code = await verifyEmail(emailController.text.toString());
                if (code == 1) {
                } else if (code == 0) {
                } else {
                  if (!mounted) return;
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => EmailScreen(
                            code: code,
                            fName: firstNameController.text.toString(),
                            lName: lastNameController.text.toString(),
                            uName: userNameController.text.toString(),
                            pass: passwordController.text.toString(),
                            email: emailController.text.toString())),
                  );
                }

                // final num = await registerUser(
                //     firstNameController.text.toString(),
                //     lastNameController.text.toString(),
                //     userNameController.text.toString(),
                //     emailController.text.toString(),
                //     passwordController.text.toString());
                // if (num == 1) {
                //   if (!mounted) return;
                //   ScaffoldMessenger.of(context).showSnackBar(
                //       const SnackBar(content: Text('Succesfully Registered')));
                // } else if (num == 2) {
                //   if (!mounted) return;
                //   ScaffoldMessenger.of(context).showSnackBar(
                //       const SnackBar(content: Text('Invalid Email')));
                // } else if (num == 3) {
                //   if (!mounted) return;
                //   ScaffoldMessenger.of(context).showSnackBar(
                //       const SnackBar(content: Text('Invalid Password')));
                // } else {
                //   if (!mounted) return;
                //   ScaffoldMessenger.of(context).showSnackBar(
                //     const SnackBar(content: Text('Register Failed')),
                //   );
                // }
              },
              child: Container(
                height: 50,
                decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10)),
                child: Center(child: Text('Register')),
              ),
            )
          ],
        ),
      ),
    );
  }
}
