package work.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import work.config.definition.UserInfo;
import work.controller.web.LoginController;
import work.entity.po.User;
import work.service.UserService;
/**
 * 
 * @author chuan
 *
 */
@RestController()
@RequestMapping("/api")
@Api(value="用户接口",tags={"login"})//接口简要标注，对中文的支持不太好
public class UseLogin {
	
	@Autowired 
	private UserService uSerives;
	
	@RequestMapping(value={"/user/getall"})
	public List<User> getAll(@UserInfo String username){
		System.err.println("注解活的结果="+username);
		return uSerives.getAllUser();
	}

	 @ApiImplicitParams({
        @ApiImplicitParam(paramType = "header", name = "Token", value = "token", dataType = "String", required = true,defaultValue = "user")})
	 //接口功能描述
	 @ApiOperation(value = "判断当前用户是否登陆,跳转到登陆页面")
	 @ApiResponses(value = { @ApiResponse(code = 401, message = "请求未通过认证.", response = LoginController.class) })
	@RequestMapping(value="/checkuser",method=RequestMethod.GET)
	 public User checkUser(String userid){
			 return uSerives.findUser(userid);
		}
	 
}
