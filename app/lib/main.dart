// import 'dart:async';

import 'package:app/register.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
// import 'package:http/http.dart' as http;
// import 'dart:async';
// import 'dart:convert';
import 'home.dart';
import 'api.dart';
import 'color.dart';

var num = 0;

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
          primarySwatch: createColor(Color(0xFFff4b5c)),
          textTheme: TextTheme(
              displayLarge: const TextStyle(
            fontFamily: 'Courier',
            fontSize: 72,
          ))),
      home: const Login(title: 'Dare2Do'),
    );
  }
}

class Login extends StatefulWidget {
  const Login({Key? key, required this.title}) : super(key: key);
  final String title;

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  TextEditingController loginController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final Size size = MediaQuery.of(context).size;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: Text(widget.title),
        titleTextStyle: TextStyle(
            fontFamily: 'Courier New',
            fontWeight: FontWeight.w600,
            fontSize: 40),
        backgroundColor: Color(0xFFff4b5c),
      ),
      body: SingleChildScrollView(
        child: Container(
          height: size.height * 0.9,
          width: size.width,
          decoration: BoxDecoration(
              gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF222233), Color(0xFF555577)])),
          child: Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                    child: TextFormField(
                      controller: loginController,
                      decoration: const InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: "Username"),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your username';
                        }
                        return null;
                      },
                    ),
                  ),
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 16),
                    child: TextFormField(
                      controller: passwordController,
                      obscureText: true,
                      decoration: const InputDecoration(
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(),
                          labelText: "Password"),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter your password';
                        }
                        return null;
                      },
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 16.0),
                    child: Center(
                      child: ElevatedButton(
                        onPressed: () {
                          loginController.text = '';
                          passwordController.text = '';
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => RegisterScreen()),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFFff4b5c),
                        ),
                        child: const Text('Register'),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 16.0),
                    child: Center(
                      child: ElevatedButton(
                        onPressed: () async {
                          if (_formKey.currentState!.validate()) {
                            final num = await signIn(
                                loginController.text.toString(),
                                passwordController.text.toString());
                            if (num == 1) {
                              if (!mounted) return;
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => HomeScreen(
                                          login: loginController.text,
                                        )),
                              );
                              loginController.text = '';
                              passwordController.text = '';
                            } else {
                              if (!mounted) return;
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text('Invalid Credentials')),
                              );
                            }
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content: Text('Please fill input')),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFff4b5c)),
                        child: const Text('Login'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// const String url = "https://progress-tracker-4331-88c53c23c126.herokuapp.com";

// Future<void> signIn(String login, String password) async {
//   Map data = {
//     "login": login,
//     "password": password,
//   };

//   const Map<String, String> header = {
//     'Content-type': 'application/json',
//     'Accept': 'application/json',
//   };

//   var jsonData = jsonEncode(data).toString();
//   var response;
//   response = await http.post(Uri.parse("$url/api/login"),
//       body: jsonData, headers: header);
//   if (response.statusCode == 200) {
//     //     print(response.body);
//     // print(response.body.toString() == '{"error":"Login/Password incorrect"}');
//     if (response.body.toString() == '{"error":"Login/Password incorrect"}') {
//       num = 0;
//       print('Login failed');
//     } else {
//       print('Login successful');
//       num = 1;
//     }
//   } else {
//     print('failed');
//     num = 1;
//   }
// }

// // Future<void> addTask(String id, String taskName, String taskDescription,
// //     String taskDifficulty) async {
// //   Map data = {
// //     "userId": id,
// //     "taskName": taskName,
// //     "taskDescription": taskDescription,
// //     "taskDifficulty": taskDifficulty,
// //   };

// //   const Map<String, String> header = {
// //     'Content-type': 'application/json',
// //     'Accept': 'application/json',
// //   };

// //   var jsonData = jsonEncode(data).toString();
// //   var response;
// //   response = await http.post(Uri.parse("$url/api/addTask"),
// //       body: jsonData, headers: header);
// //   if (response.statusCode == 200) {
// //     print('Task added');
// //   } else {
// //     print('Failed to add task');
// //   }
// // }

// class HomePage extends StatelessWidget {
//   const HomePage({super.key, required this.login});

//   final String login;

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//         appBar: AppBar(
//           title: const Text('Home Page'),
//         ),
//         body: Column(
//           children: [
//             Text(login),
//             Center(
//               child: ElevatedButton(
//                 onPressed: () {
//                   Navigator.pop(context);
//                 },
//                 child: const Text("Go back!"),
//               ),
//             ),
//           ],
//         ));
//   }
// }
