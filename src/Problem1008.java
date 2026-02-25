import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Problem11 {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer stringTokenizer= new StringTokenizer(in.readLine());
        String N = stringTokenizer.nextToken();
        String K = stringTokenizer.nextToken();
        Double result = Double.parseDouble(N) / Double.parseDouble(K);
        System.out.println(result);
    }
}
