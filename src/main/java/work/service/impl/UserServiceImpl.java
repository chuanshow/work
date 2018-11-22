package work.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import work.entity.po.User;
import work.reposisty.UserMapper;

@Service
public class UserServiceImpl implements UseService{
	
	@Autowired 
	private UserMapper umapeer;

	public List<User> getAllUser() {
		return umapeer.selectAll();
	}
}
