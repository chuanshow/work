package work.config.interceptor;

import java.util.LinkedHashMap;

import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.cache.MemoryConstrainedCacheManager;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import work.config.realm.AuthRealm;
import work.config.realm.CredentialMatcher;


@Configuration
public class ShiroConfiguration {
	 @Bean("shiroFilter")
	    public ShiroFilterFactoryBean shiroFilter(@Qualifier("securityManager") SecurityManager manager) {
	        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
	        bean.setSecurityManager((org.apache.shiro.mgt.SecurityManager) manager);
	 
	        bean.setLoginUrl("/index/login");//提供登录到url
	        bean.setSuccessUrl("/web/hi");//提供登陆成功的url
	       
	        /*
	         * 可以看DefaultFilter,这是一个枚举类，定义了很多的拦截器authc,anon等分别有对应的拦截器
	         * */
	        LinkedHashMap<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
	        filterChainDefinitionMap.put("/web/**", "authc");
	        filterChainDefinitionMap.put("/api/**", "authc");
	        filterChainDefinitionMap.put("/user/login/*", "anon");//代表着前面的url路径，用后面指定的拦截器进行拦截
	        filterChainDefinitionMap.put("/static/**", "anon");
	        filterChainDefinitionMap.put("/templates/**", "anon");//
	        filterChainDefinitionMap.put("/producer/*", "anon");//
	        bean.setFilterChainDefinitionMap(filterChainDefinitionMap);//设置一个拦截器链
	        return bean;
	    }
	    
	    
	    /*
	     * 注入一个securityManager
	     * 原本以前我们是可以通过ini配置文件完成的，代码如下：
	     *  1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager
	        Factory<SecurityManager> factory = new IniSecurityManagerFactory("classpath:shiro.ini");
	        2、得到SecurityManager实例 并绑定给SecurityUtils
	        SecurityManager securityManager = factory.getInstance();
	        SecurityUtils.setSecurityManager(securityManager);
	     * */
	    @Bean("securityManager")
	    public SecurityManager securityManager(@Qualifier("authRealm") AuthorizingRealm authRealm) {
	    	//这个DefaultWebSecurityManager构造函数,会对Subject，realm等进行基本的参数注入
	        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
	        manager.setRealm(authRealm);//往SecurityManager中注入Realm，代替原本的默认配置
	        return manager;
	    }
	    //自定义的Realm
	    @Bean("authRealm")
	    public AuthRealm authRealm( CredentialMatcher  matcher) {
	        AuthRealm authRealm = new AuthRealm();
	        //这边可以选择是否将认证的缓存到内存中，现在有了这句代码就将认证信息缓存的内存中了
	        authRealm.setCacheManager(new MemoryConstrainedCacheManager());
	        //最简单的情况就是明文直接匹配，然后就是加密匹配，这里的匹配工作则就是交给CredentialsMatcher来完成
	        authRealm.setCredentialsMatcher(matcher);
	        return authRealm;
	    }
	    @Bean("credentialMatcher")
	    public CredentialMatcher credentialMatcher() {
	        return new CredentialMatcher();
	    }
	    
	    @Bean("MyHandlerMethodArgumentResolver")
	    public MyHandlerMethodArgumentResolver creatResolver() {
	        return new MyHandlerMethodArgumentResolver();
	    }
	    @Bean
	    public HashedCredentialsMatcher hashedCredentialsMatcher() {
	        HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();
	        hashedCredentialsMatcher.setHashAlgorithmName("MD5");//散列算法:MD2、MD5、SHA-1、SHA-256、SHA-384、SHA-512等。
	        hashedCredentialsMatcher.setHashIterations(1);//散列的次数，默认1次， 设置两次相当于 md5(md5(""));
	        return hashedCredentialsMatcher;
	    }
	    /*
	     * 以下AuthorizationAttributeSourceAdvisor,DefaultAdvisorAutoProxyCreator两个类是为了支持shiro注解
	     * */
	    @Bean
	    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(@Qualifier("securityManager") SecurityManager securityManager) {
	        AuthorizationAttributeSourceAdvisor advisor = new AuthorizationAttributeSourceAdvisor();
	        advisor.setSecurityManager(securityManager);
	        return advisor;
	    }
	 
	    @Bean
	    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
	        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
	        creator.setProxyTargetClass(true);
	        return creator;
	    }

}
