import 'package:flutter/material.dart';
import 'package:http/http.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  RegisterScreenState createState() => RegisterScreenState();
}

class RegisterScreenState extends State<RegisterScreen> {
  TextEditingController userNameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

  // void register(String userName, String password) async {
  //   try {

  //   } catch (e) {
  //     print(e.toString());
  //   }
  // }

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
                // register(userNameController.text.toString(),
                //     passwordController.text.toString());
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
