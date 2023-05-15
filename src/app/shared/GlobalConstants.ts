export class GlobalConstants {

  //Message
  public static genericErrorMessage : string = " Something went wrong. Please try again.";
  public static unauthorized : string = " You are not allow to access this page.";

  //Regex
  public static nameRegex : string = "[a-zA-Z0-9 ]*"
  public static emailRegex : string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}"
  public static contactNumberRegex : string = "^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$"

  // Variables
  public static error : string = "error";
}
