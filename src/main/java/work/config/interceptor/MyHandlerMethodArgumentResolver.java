package work.config.interceptor;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import work.config.definition.UserInfo;
import work.entity.po.User;

/**
 * 自定义解析工具
 * @author chuan
 *
 */
public class MyHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver  {
	
	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		UserInfo user = parameter.getParameter().getAnnotation(UserInfo.class);
		if(user==null)
		return false;
		return true;
	}
	/**
	 * 初始化值
	 */
	public MyHandlerMethodArgumentResolver() {
		Stream.of(User.class.getDeclaredFields()).forEach(f -> {
			userColumns.put(f.getName(), f);
		});
	}
	private Map<String, Field> userColumns = new HashMap<>();
	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		Subject subject = SecurityUtils.getSubject();
		if (!subject.isAuthenticated())
			return null;
		UserInfo cuser = parameter.getParameter().getAnnotation(UserInfo.class);
		if (cuser == null)
			return null;
		Class<?> klass = parameter.getParameterType();
		User lu = (User) subject.getPrincipal();
		if (lu == null) {
			return null;
		}
		if (klass.isAssignableFrom(User.class)) {
			return lu;
		}
		if(klass.isAssignableFrom(String.class)){
			String name = StringUtils.isNotBlank(cuser.columnName()) ? cuser.columnName() : parameter.getParameterName();
			userColumns.get(name).setAccessible(true);
			String result = (String) userColumns.get(name).get(lu);
			if(result!=null)
				return result;
			return null;
		}
		return null;
	}

}
