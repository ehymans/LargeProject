import 'package:flutter/material.dart';
import 'api.dart';
import 'home.dart';

class EmailScreen extends StatefulWidget {
  const EmailScreen(
      {super.key,
      required this.code,
      required this.fName,
      required this.lName,
      required this.uName,
      required this.pass,
      required this.email});

  final code;
  final String fName;
  final String lName;
  final String uName;
  final String pass;
  final String email;

  @override
  EmailScreenState createState() => EmailScreenState();
}

class EmailScreenState extends State<EmailScreen> {
  TextEditingController verificationController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Email Verification'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              controller: verificationController,
              decoration: InputDecoration(hintText: 'Verification Code'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (int.parse(verificationController.text.toString()) ==
                    widget.code) {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content: Text('Email Successfully Verified!')),
                  );
                  final num = await registerUser(widget.fName, widget.lName,
                      widget.uName, widget.email, widget.pass);
                  if (num == 1) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text('Succesfully Registered')));
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => HomeScreen(
                                login: widget.uName,
                              )),
                    );
                  } else if (num == 2) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Invalid Email')));
                  } else if (num == 3) {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Invalid Password')));
                  } else {
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Register Failed')),
                    );
                  }
                }
              },
              child: const Text("Verify"),
            ),
          ],
        ),
      ),
    );
  }
}
