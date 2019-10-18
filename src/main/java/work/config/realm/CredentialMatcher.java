package work.config.realm;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;

import work.util.MyPasswordSaltUtil;
/**
 * 密码校验方法继承SimpleCredentialsMatcher或HashedCredentialsMatcher类，自定义实现doCredentialsMatch方法
*直接使用的 HashedCredentialsMatcher  该类没有自定义使用
 */
public class CredentialMatcher extends HashedCredentialsMatcher{
	

    
	/*
	 * 这里是进行密码匹配的方法，自己定义
	 * 通过用户的唯一标识得到 AuthenticationInfo 然后和 AuthenticationToken （用户名 密码），进行比较
	 * */
    @Override
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
    	UsernamePasswordToken usernamePasswordToken = (UsernamePasswordToken) token;
        String password = new String(usernamePasswordToken.getPassword());
    	String saltpassword =MyPasswordSaltUtil.encryptPassword("MD5", password);
        String dbPassword = (String) info.getCredentials();//数据库里的密码
        return this.equals(saltpassword, dbPassword);
    }
}
