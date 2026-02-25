import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class Probblem2743 {
	public static void main(String[] args)throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
		String[] text = br.readLine().split("");
		System.out.print(text.length);
	}
}
