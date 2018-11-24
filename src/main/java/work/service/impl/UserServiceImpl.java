package work.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import work.entity.po.User;
import work.reposisty.UserMapper;
import work.service.UserService;
import work.util.MyPasswordSaltUtil;

@Service
public class UserServiceImpl implements UserService{
	@Value("salt")
	private String salt;
	@Autowired 
	private UserMapper umapeer;

	public List<User> getAllUser() {
		return umapeer.selectAll();
	}

	@Override
	public User findUser(String userid) {
		return umapeer.selectByPrimaryKey(userid);
	}

	@Override
	public Integer save(User user) {
		String saltpassword =MyPasswordSaltUtil.encryptPassword("MD5", user.getPassword());
		user.setPassword(saltpassword);
		return umapeer.insert(user);
	}

	@Override
	public User findUserByName(String uname) {
		return umapeer.findUserByName(uname);
	}
}
