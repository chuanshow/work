package work.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import work.entity.po.User;
import work.service.impl.UseService;
/**
 * 
 * @author chuan
 *
 */
@RestController()
public class UseLogin {

	@Autowired 
	private UseService uSerives;
	
	@RequestMapping(value={"/user/getall",""})
	public List<User> getAll(){
		return uSerives.getAllUser();
	}
	
}
