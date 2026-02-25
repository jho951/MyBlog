import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Problem12 {
    public static void main(String[] args)throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer stringTokenizer= new StringTokenizer(in.readLine());
        String A = stringTokenizer.nextToken();
        String B = stringTokenizer.nextToken();
        System.out.println(Integer.parseInt(A) + Integer.parseInt(B));
        System.out.println(Integer.parseInt(A) - Integer.parseInt(B));
        System.out.println(Integer.parseInt(A) * Integer.parseInt(B));
        System.out.println(Integer.parseInt(A) / Integer.parseInt(B));
        System.out.println(Integer.parseInt(A) % Integer.parseInt(B));
    }
}
