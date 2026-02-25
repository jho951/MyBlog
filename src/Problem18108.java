import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Problem14 {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer stringTokenizer= new StringTokenizer(in.readLine());
        int result = Integer.parseInt(stringTokenizer.nextToken());
        System.out.println(result - 543);
    }
}
