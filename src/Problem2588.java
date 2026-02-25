import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.StringTokenizer;

public class Problem16 {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        StringTokenizer tw = new StringTokenizer(br.readLine());
        int N = Integer.parseInt(st.nextToken());
        int M = Integer.parseInt(tw.nextToken());
        String str = Integer.toString(M);
        int[] L = new int[str.length()];
        for (int i = 0; i < str.length(); i++) {
            L[i] = Character.getNumericValue(str.charAt(str.length()- 1 - i));
        }
        for (int j : L) {
            System.out.println(N*j);
        }
        System.out.println(N*M);
    }
}
