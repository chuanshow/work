package work.config.webmvc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;

import com.alibaba.druid.support.http.StatViewServlet;

import work.config.interceptor.MyHandlerMethodArgumentResolver;
@Configuration
public class WebMvcConfig implements org.springframework.web.servlet.config.annotation.WebMvcConfigurer{
	@Autowired
	private MyHandlerMethodArgumentResolver HandlerMethodArgumentResolver;
	
	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(HandlerMethodArgumentResolver);

	}
	/**
     * 注册一个StatViewServlet
     * 配置druid监控
     * @return
     */
    @Bean
    public ServletRegistrationBean<StatViewServlet> DruidStatViewServle2(){
       //org.springframework.boot.context.embedded.ServletRegistrationBean提供类的进行注册.
       ServletRegistrationBean<StatViewServlet> servletRegistrationBean = new ServletRegistrationBean( new StatViewServlet(),"/druid/*");
       
       //添加初始化参数：initParams
       
       //白名单：
       servletRegistrationBean.addInitParameter("allow","127.0.0.1");
       //IP黑名单 (存在共同时，deny优先于allow) : 如果满足deny的话提示:Sorry, you are not permitted to view this page.
       servletRegistrationBean.addInitParameter("deny","192.168.1.73");
       //登录查看信息的账号密码.
       servletRegistrationBean.addInitParameter("loginUsername","admin");
       servletRegistrationBean.addInitParameter("loginPassword","123456");
       //是否能够重置数据.
       servletRegistrationBean.addInitParameter("resetEnable","false");
       return servletRegistrationBean;
    }
	
}
