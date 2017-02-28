# xss-scanner
Cross-Site Scripting (XSS) scanner.  This tool helps to find possible XSS vulnerabilities.  It's intended use is to help "plug" the vulnerability, *not* exploit.  Be nice.  Make the web better.

The three most important countermeasures to prevent cross-site scripting attacks are to: 

  * Constrain input. 
  * Encode output.
  * Filter user input.

Url encode output URLs if they are constructed from input.

Html encode output if it contains input from the user or from other sources such as databases. 

## Installation
`npm install`

## Configuration
Open up the `config.js` file and configure the `xssOptions()` return object.

## Run
`npm start`

## Results
The console shows the XSS parameter values that have made it back with a status code 200.  You can also dump the resulting Html to a file.  Unfortunately, you have to manually check these.  I prefer to use the latest version of Firefox with add-ons and extensions disabled.  Other XSS tools, such as Burp Suite, also required some manual checking.

At the top of the Html content, look for a `<![CDATA[ \"-alert(123456789))// ]]>`.  It contains the offending XSS injection payload value.

## Additional Resources

[OWASP XSS Cheatsheet](https://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet)
