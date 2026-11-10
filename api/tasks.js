const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);
  // pathParts: ['api', 'tasks', ':id?']

  try {
    // GET /api/tasks - 获取所有任务
    if (req.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    // GET /api/tasks/:id - 获取单个任务
    if (req.method === 'GET' && pathParts.length === 3) {
      const id = pathParts[2];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST /api/tasks - 添加任务
    if (req.method === 'POST' && pathParts.length === 2) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, priority } = body;

      if (!title) {
        return res.status(400).json({ error: '标题不能为空' });
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([{ title, priority: priority || '中' }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    // PUT /api/tasks/:id - 更新任务（切换完成状态）
    if (req.method === 'PUT' && pathParts.length === 3) {
      const id = pathParts[2];
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { completed, title, priority } = body;

      const updateData = {};
      if (completed !== undefined) updateData.completed = completed;
      if (title !== undefined) updateData.title = title;
      if (priority !== undefined) updateData.priority = priority;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    // DELETE /api/tasks/:id - 删除任务
    if (req.method === 'DELETE' && pathParts.length === 3) {
      const id = pathParts[2];
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
