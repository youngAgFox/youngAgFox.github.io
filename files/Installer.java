import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

public class Installer {

    private static final String REGEX = ".*AssignmentTodo.*\\.jar$";
    private static int tries = 4;

    public static void main(String[] args) {
        if (args.length != 1)
            exit("Incorrect number of arguments, expected <download URL>");

        String jarURL = args[0];
        System.out.println("You have done it you son of a bitch XD: " + jarURL);
        URL url = createURL(jarURL);
        if (url != null) download(url);
        else System.err.println("Failed to createURL from " + jarURL);
    }

    private static URL createURL(String urlPath) {
        try {
            return new URL(urlPath);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void download(URL url) {
        try {
            InputStream stream = url.openStream();
            File file = new File(System.getProperty("user.dir"), scanJarName());
            Files.copy(stream, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            if (tries > 0) {
                tries--;
                System.out.println("Failed attempt, remaining: " + tries);

                download(url);
            } else exit("Failed to replace jar");
        }
    }

    private static void exit(String message) {
        System.err.println(message);
        try {
            Runtime.getRuntime().exec("java -jar " + scanJarName() + " noUpdate");
        } catch (NullPointerException | IOException e) {
            System.err.println("Failed to restart jar: " + e.getMessage());
        }
        System.exit(1);
    }

    private static String scanJarName() {
        final String dirName = System.getProperty("user.dir");
        File dir = new File(dirName);
        if (dir.exists() && dir.isDirectory()) {
            String[] files = dir.list((dir1, name) -> name.matches(REGEX));
            if (files != null && files.length == 1)
                return files[0];
        }
        throw new NullPointerException("Directory did not exist");
    }

}