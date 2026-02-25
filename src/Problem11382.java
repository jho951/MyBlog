import java.io.*;
import java.util.StringTokenizer;

public class Problem17 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer stringTokenizer= new StringTokenizer(br.readLine());
        Long N = Long.parseLong(stringTokenizer.nextToken());
        Long M = Long.parseLong(stringTokenizer.nextToken());
        Long K = Long.parseLong(stringTokenizer.nextToken());
        System.out.println(N + M + K);
    }
}
