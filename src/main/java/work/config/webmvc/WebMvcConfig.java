package work.config.webmvc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;

import work.config.interceptor.MyHandlerMethodArgumentResolver;
@Configuration
public class WebMvcConfig implements org.springframework.web.servlet.config.annotation.WebMvcConfigurer{
	@Autowired
	private MyHandlerMethodArgumentResolver HandlerMethodArgumentResolver;
	
	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(HandlerMethodArgumentResolver);

	}
	
}
