package work.util;

import org.apache.shiro.crypto.hash.SimpleHash;

public class MyPasswordSaltUtil {

	 /**
     * 获取加密后的密码，使用默认hash迭代的次数 1 次
     *
     * @param hashAlgorithm hash算法名称 MD2、MD5、SHA-1、SHA-256、SHA-384、SHA-512、etc。
     * @param password      需要加密的密码
     * @param salt          盐
     * @return 加密后的密码
     */
    public static String encryptPassword(String hashAlgorithm, String password,String salt) {
        return encryptPassword(hashAlgorithm, password);
    }
    
    /**
     * 获取加密后的密码，需要指定 hash迭代的次数
     *
     * @param hashAlgorithm  hash算法名称 MD2、MD5、SHA-1、SHA-256、SHA-384、SHA-512、etc。
     * @param password       需要加密的密码
     * @param salt           盐
     * @param hashIterations hash迭代的次数
     * @return 加密后的密码
     */
    public static String encryptPassword(String hashAlgorithm, String password,String salt,int hashIterations) {
        SimpleHash hash = new SimpleHash(hashAlgorithm, password,salt,hashIterations);
        return hash.toString();
    }
    /**
     * 不加盐
     * @param hashAlgorithm
     * @param password
     * @return
     */
    public static String encryptPassword(String hashAlgorithm, String password) {
        SimpleHash hash = new SimpleHash(hashAlgorithm, password);
        return hash.toString();
    }
    public static void main(String[] args) {
        String hashAlgorithmName = "MD5";
        String credentials = "123456";
        int hashIterations = 1024;
        Object obj = new SimpleHash(hashAlgorithmName, credentials, "work", hashIterations);
        System.out.println(obj);

    }
}
