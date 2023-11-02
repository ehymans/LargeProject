import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:async';
import 'dart:convert';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  RegisterScreenState createState() => RegisterScreenState();
}

const String url = "https://progress-tracker-4331-88c53c23c126.herokuapp.com";

int num = 0;

Future<void> registerUser(
    String firstName, String lastName, String login, String password) async {
  Map data = {
    "first name": firstName,
    "last name": lastName,
    "username": login,
    "password": password
  };
  var jsonData = jsonEncode(data);
  var response = await http.post(Uri.parse("$url/api/register"),
      body: jsonData, headers: {'Content-type': 'application/json'});
  print(response.statusCode);
  print(response.body);
  if (response.statusCode == 200) {
    print(data);
    print('Register successfully');
    num = 1;
  } else {
    print('failed');
    num = 0;
  }
}

class RegisterScreenState extends State<RegisterScreen> {
  TextEditingController userNameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

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
                controller: passwordController,
                decoration: InputDecoration(hintText: 'Password')),
            SizedBox(height: 40),
            GestureDetector(
              onTap: () {
                registerUser(
                    firstNameController.text.toString(),
                    lastNameController.text.toString(),
                    userNameController.text.toString(),
                    passwordController.text.toString());
                if (num == 1) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Succesfully Registered')),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Register Failed')),
                  );
                }
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
