package work.config.definition;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 当前登录用户
 * 
 * <p>
 * 参考{@link http://yingzhuo.iteye.com/blog/2009123}
 * </p>
 * 
 *
 * @author chuan
 */
@Documented
@Target({ ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface UserInfo {
	String columnName() default "";

}
