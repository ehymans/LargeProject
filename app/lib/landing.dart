import 'package:flutter/material.dart';
import 'package:typewritertext/typewritertext.dart';
import 'register.dart';
import 'main.dart';

class LandingPage extends StatefulWidget {
  const LandingPage({super.key});

  @override
  LandingPageState createState() => LandingPageState();
}

class LandingPageState extends State<LandingPage> {
  // initializing 2 variables
  int _currentIndex = 0;
  int _currentCharIndex = 0;

  // creating List
  final List<String> _strings = [
    "Welcome to GeeksforGeeks",
    "Get Programming Solution Here",
    "And more...",
  ];
  // creating a function and future delay for iteration
  void _typeWritingAnimation() {
    if (_currentCharIndex < _strings[_currentIndex].length) {
      _currentCharIndex++;
    } else {
      _currentIndex = (_currentIndex + 1) % _strings.length;
      _currentCharIndex = 0;
    }
    setState(() {});

    Future.delayed(const Duration(milliseconds: 50), () {
      _typeWritingAnimation();
    });
  }

  @override
  Widget build(BuildContext context) {
    //_typeWritingAnimation();
    return Scaffold(
        body: Container(
      decoration: BoxDecoration(
          gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF222233), Color(0xFF555577)])),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(15.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TypeWriterText(
                    text: Text("Welcome to Dare2Do   ",
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: "Courier New",
                            fontSize: 40,
                            fontWeight: FontWeight.w600)),
                    duration: Duration(milliseconds: 350)),
                TypeWriterText(
                    text: Text("|",
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: "Courier New",
                            fontSize: 40,
                            fontWeight: FontWeight.w600)),
                    duration: Duration(milliseconds: 500),
                    repeat: true),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(15.0),
            child: SizedBox(
              width: 700,
              child: Text(
                "With our gamified task manager, finding motivation to get things done has never been easier.",
                style: TextStyle(
                    color: Colors.white,
                    fontFamily: "Gill Sans MT",
                    fontSize: 25,
                    fontWeight: FontWeight.w500),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(20),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => Login(title: "Dare2DO"),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB71F1F),
                  ),
                  child: Text("Login", style: TextStyle(color: Colors.white)),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => RegisterScreen()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB71F1F),
                  ),
                  child:
                      Text("Register", style: TextStyle(color: Colors.white)),
                ),
              ),
            ],
          )
        ],
      ),
    ));
  }
}
