<template>
	<div class="info-container" ref="infoBox" :class="containerClasses">
		<button class="btn-close" @click="resetToLegends" v-if="status != ''">&#10006;</button>
		<h2>{{ current.heading }}</h2>
		<p class="main-content" v-html="current.text"></p>
		<div class="swarm-unlocked" v-if="status == 'attributions' && swarmUnlocked">Extra algorithm unlocked</div>
		<div class="info-buttons">
			<Button class="info" @click="startTutorial" v-if="status == ''">Tutorial</Button>
			<Button class="danger" @click="showAttributions" v-if="status == ''">Credits</Button>
			<a href="https://github.com/AdrijaDastidar/MPPI-GA" target="_blank" rel="noopener noreferrer">
				<Button class="white" v-if="status == ''">
					<img src="@/assets/icons/github-logo.svg" alt="" />
				</Button>
			</a>
			<!-- Tutorial buttons -->
			<div class="tutorial-buttons" v-if="status == 'tutorial'">
				<Button class="danger btn-tutorial" @click="resetToLegends">Skip</Button>
				<div class="btn-group">
					<Button class="info btn-tutorial" :disabled="tutorialIndex == 0" @click="tutorialIndex--">Prev</Button>
					<Button class="info btn-tutorial" @click="tutorialIndex == tutorial.length-1 ? resetToLegends() : tutorialIndex++">{{ tutorialIndex == tutorial.length-1 ? 'End' : 'Next' }}</Button>
				</div>
				<small>{{ tutorialIndex + 1 }}/{{ tutorial.length }}</small>
			</div>
		</div>
		<img class="info-icon" src="@/assets/icons/info.svg">
	</div>
</template>

<script>
export default {
	props: {
		info: Object,
		colors: Object
	},
	data: () => ({
		status: '',
		current: {
			heading: "",
			text: ""
		},
		unlockTapCount: 0,
		unlockTapTimeout: null,
		swarmUnlocked: false,
		tutorial: [
			{
				heading: "MPPI-GA — 3D pathfinding",
				text: `This is a 3D visualizer for multiple pathfinding algorithms.
				<br> 
				A pathfinding algorithm seeks to find the shortest path between two points.
				<br><br> 
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/road.png" style="width: 120px; margin: 10px;">
				</div><br>
				All of the algorithms on this web-app are adapted for a 2D grid, where 90 degree turns have a cost of 1 and movements from a node to another have a cost of 1.`
			},
			{
				heading: "Setup the world",
				text: `Click the button on the right to setup the world. 
				<br> 
				You can change the start/end positions and add walls easily by clicking and dragging.
				<br>
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/setupWorld.jpg" style="width: 160px; margin: 10px;">
					<img src="img/tutorial/setupWorld2.jpg" style="width: 150px; margin: 10px;">
				</div>
				<br>
				<small>Walls are represented as buildings on the grid.</small>`
			},
			{
				heading: "Capture using Device Camera",
				text: `While setting up the world, click on the camera icon to get the feed from your device camera and create the grid. 
				<br> 
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/deviceCamButton.jpg" style="width: 160px; margin: 10px;">
					<img src="img/tutorial/deviceCamPreview.jpg" style="width: 80px; margin: 10px;">
					<img src="img/tutorial/deviceCamGrid.jpg" style="width: 160px; margin: 10px;">
				</div>
				<br>
				You can preview the feed in the bottom left corner and also set the brightness threshold level. Remember, dark pixels = walls.
				<br><br>
				<small>(Might affect performance)</small>`
			},
			{
				heading: "Select algorithm",
				text: `Select an algorithm from the top-left dropdown and click the Visualize button to, you know, visualize it.
				<br>
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/selectAlgo.jpg" style="width: 250px; margin: 10px;">
				</div>
				You can change the speed from the right-most dropdown.
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/speed.jpg" style="width: 120px; margin: 10px;">
				</div>
				`
			},
			{
				heading: "Camera Movement",
				text: `Easily pan, rotate or dolly the camera as per you liking.
				<br><br>
				<table class="camera-table">
					<tr>
						<td>Left Click & drag/Finger drag</td>
						<td>Rotate</td>
					</tr>
					<tr>
						<td>Mousewheel/Two finger pinch</td>
						<td>Dolly</td>
					</tr>
					<tr>
						<td>Right Click & drag/Two finger drag</td>
						<td>Pan</td>
					</tr>
				</table>
				<br><br>
				<small>I know you'll try to zoom all the way back to see what the Earth looks like. That's why I specifically put nothing there.</small>
				`
			},
			{
				heading: "Generate a maze",
				text: `Feeling lazy to add walls yourself? Select an algorithm from the Maze Algorithms dropdown to generate a maze.
				<br>
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/maze.jpg" style="width: 160px; margin: 10px;">
					<img src="img/tutorial/maze2.jpg" style="width: 200px; margin: 10px;">
				</div><br>
				<small>Don't be lazy to click the Visualize button though.</small>`
			},
			{
				heading: "First-Person view",
				text: `Love FPS games? You're in the right place! Only minus the Shooting part.
				<br><br>
				Click the First-Person button to dive right into the world!
				<br><br>
				<div style="display:flex; flex-wrap: wrap; align-items: center; justify-content: center;">
					<img src="img/tutorial/firstPerson.jpg" style="width: 150px; margin: 10px;">
					<img src="img/tutorial/firstPerson2.jpg" style="width: 200px; margin: 10px;">
				</div><br>
				<table class="camera-table">
					<tr>
						<td>W/A/S/D</td>
						<td>Move</td>
					</tr>
					<tr>
						<td>Space</td>
						<td>Jump</td>
					</tr>
					<tr>
						<td>Mouse</td>
						<td>Camera control</td>
					</tr>
				</table>
				<br>
				<small>Try it to know how Hulk feels while moving through the city.</small>`
			},
			{
				heading: "Have fun!",
				text: `Source code: <a href="https://github.com/AdrijaDastidar/MPPI-GA" target="_blank" rel="noopener noreferrer">GitHub</a>.
				`
			},
		],
		tutorialIndex: 0,
		legends: {
			heading: "MPPI-GA",
			text: "" // Will be generated on created()
		},
		attributions: {
			heading: "Credits",
			text: `<div style="text-align: left">
				<h3 style="margin: 5px 0; opacity: 0.4">Repository</h3>
				<a href="https://github.com/AdrijaDastidar/MPPI-GA" target="_blank" rel="noopener noreferrer">github.com/AdrijaDastidar/MPPI-GA</a>
				<br><br>
				<h3 style="margin: 5px 0; opacity: 0.4">Rendering</h3>
				<a href="https://threejs.org/" target="_blank" rel="noopener noreferrer">Three.js</a>
				<br><br>
				<h3 style="margin: 5px 0; opacity: 0.4">Assets</h3>
				Textures: <a href="https://opengameart.org/" target="_blank" rel="noopener noreferrer">OpenGameArt.org</a><br>
				Icons: <a href="https://www.flaticon.com/authors/freepik" target="_blank" rel="noopener noreferrer">Freepik</a> via <a href="https://www.flaticon.com/" target="_blank" rel="noopener noreferrer">Flaticon</a>
				<br><br>
				<p style="opacity: 0.75; font-size: 0.9em"><span id="unlock-trigger" tabindex="0">Project</span> — tap the word five times within a few seconds to unlock an extra algorithm in the list.</p>
			</div>
			`
		}
	}),
	computed: {
		containerClasses() {
			let classes = {
				centered: this.status == 'tutorial' || this.status == 'attributions'
			}
			classes[this.status] = true;
			return classes;
		}
	},
	watch: {
		tutorialIndex: function(newVal, oldVal) {
			this.current = this.tutorial[newVal];
		}
	},
	created() {
		this.current = this.legends;
	},
	mounted() {
		this.constructLegends();
		let tutorialItem = localStorage.getItem('tutorial-viewed');
		tutorialItem = JSON.parse(tutorialItem);
		if(tutorialItem && tutorialItem.expiry > Date.now()) {
			setTimeout(() => {
				this.alert();
			}, 1800);
		} else {
			setTimeout(() => {
				this.startTutorial();
			}, 1800);
			let currentTimestamp = Math.round(new Date().getTime());
			currentTimestamp += 86400000 * 2; // 2 days
			localStorage.setItem('tutorial-viewed', JSON.stringify({ expiry: new Date(currentTimestamp).getTime() }));
		}
	},
	methods: {
		constructLegends() {
			//table
			this.legends.text += `<table class="legends-table">
				<tr>
					<td>
						<div class="square" style="background-color: ${this.getRGBString(this.colors.start)}"></div>
					</td>
					<td>Start Node</td>
				</tr>
				<tr>
					<td>
						<div class="square" style="background-color: ${this.getRGBString(this.colors.finish)}"></div>
					</td>
					<td>Finish Node</td>
				</tr>
				<tr>
					<td>
						<div class="square" style="background-color: ${this.getRGBString(this.colors.visited)}"></div>
					</td>
					<td>Visited Node</td>
				</tr>
				<tr>
					<td>
						<div class="square" style="background-color: ${this.getRGBString(this.colors.path)}"></div>
					</td>
					<td>Path Node</td>
				</tr>
			</table>
			`
		},

		getRGBString(color) {
			return `rgb(${color.r*255}, ${color.g*255}, ${color.b*255})`;
		},

		startTutorial() {
			this.tutorialIndex = 0;
			this.current = this.tutorial[this.tutorialIndex];
			this.status = 'tutorial';
		},

		showAttributions() {
			this.current = this.attributions;
			this.status = 'attributions';
			if(this.swarmUnlocked) return;
			this.$nextTick(() => {
				const el = document.getElementById('unlock-trigger');
				if (el) el.addEventListener('click', this.onUnlockTap);
			});
		},

		onUnlockTap() {
			if(this.swarmUnlocked) return;

			clearTimeout(this.unlockTapTimeout);
			this.unlockTapCount++;
			if(this.unlockTapCount == 5) {
				this.$emit('unlockSwarm');
				this.swarmUnlocked = true;
			}
			this.unlockTapTimeout = setTimeout(() => {
				this.unlockTapCount = 0;
			}, 3000);
		},

		resetToLegends() {
			this.$refs.infoBox.classList.remove('error');
			const trigger = document.getElementById('unlock-trigger');
			if(trigger) {
				trigger.removeEventListener('click', this.onUnlockTap);
			}
			this.current = this.legends;
			this.status = '';
		},

		alert(info) {
			this.$refs.infoBox.classList.remove('error');
			this.$refs.infoBox.classList.add('alert');
			if(info) {
				this.current = info;
			}
			setTimeout(() => {
				this.$refs.infoBox.classList.remove('alert');
			}, 1000);
		},

		error(info) {
			this.$refs.infoBox.classList.remove('error');
			setTimeout(() => {
				this.$refs.infoBox.classList.add('error');
			}, 0)
			if(info) {
				this.current = info;
			}
		}
	}
}
</script>

<style lang="scss">
@import '@/scss/variables.scss';

.info-container {
	position: absolute;
	right: 15px;
	bottom: 15px;
	width: 350px;
	max-height: 100%;
	max-width: 90%;
	display: flex;
	flex-direction: column;
	font-size: 0.9em;
	padding: 25px;
	border-radius: 5px;
	background: linear-gradient(0, $dark 0%, #000000 240%);
	color: white;
	box-shadow: 2px 10px 30px rgba(#000, 0.4);
	opacity: 0.4;
	z-index: 10000;
	clip-path: circle(30px at calc(100% - 30px) calc(100% - 30px));
	transition: all 400ms ease-in-out;

	&:hover {
		clip-path: circle(200% at calc(100% - 30px) calc(100% - 30px));
		opacity: 1;
		bottom: 20px;
	}

	&.centered {
		max-height: 90%;
		min-height: 50%;
		width: 600px;
		max-width: 95%;
		opacity: 1;
		font-size: 1em;
		text-align: center;
		right: 50%;
		bottom: 50%;
		transform: translate(50%, 50%);
		clip-path: circle(200% at calc(100% - 30px) calc(100% - 30px));
	}

	&.alert {
		animation: alert 1000ms ease-in-out;
	}
	@keyframes alert {
		0%, 100% {
			bottom: 15px;
			opacity: 0.4;
		}
		20%, 50% {
			bottom: 30px;
			opacity: 1;
		}
		40% {
			bottom: 25px;
			opacity: 1;
		}
	}

	&.error {
		background: linear-gradient(0, brown 0%, #000000 240%);
		animation: error 400ms ease-out;
	}
	@keyframes error {
		0%, 100% {
			right: 15px;
			opacity: 0.4;
		}
		20%, 60% {
			right: 25px;
			opacity: 1;
		}
		40%, 80% {
			right: 5px;
			opacity: 1;
		}
	}

	.main-content {
		opacity: 0.9;
		margin-bottom: 3em;
		overflow: auto;
	}
	&.attributions {
		.main-content {
			margin-bottom: 0;
		}
		#unlock-trigger {
			cursor: pointer;
			user-select: none;
			-moz-user-select: none;
			-webkit-user-select: none;
			text-decoration: underline;
		}
		.swarm-unlocked {
			width: fit-content;
			margin: 0 auto;
			padding: 5px;
			font-size: 0.8em;
			border-radius: 5px;
			color: #0f0;
			background: rgba(#0f0, 0.3);
		}
	}

	h2 {
		margin: 0.5em 0;
	}

	.btn-close {
		position: absolute;
		top: 10px;
		right: 10px;
		height: 30px;
		width: 30px;
		border: none;
		border-radius: 50%;
		background: transparent;
		color: white;
		cursor: pointer;
		transition: background 200ms ease-out;
		&:hover {
			background: rgba(255, 255, 255, 0.1);
		}
		&:focus {
			outline: none;
		}
	}

	a {
		color: rgb(255, 124, 124);
	}

	img {
		border-radius: 5px;
	}

	table {
		border-spacing: 0;
		font-size: 0.9em;

		&.camera-table {
			margin: 0 auto;

			td {
				width: 50%;
				border: solid 1px white;
				padding: 10px;
			}
		}
		&.legends-table {
			td {
				padding: 5px;

				.square {
					width: 30px;
					height: 30px;
					margin: 0 auto;
				}
			}
		}
	}

	.info-buttons {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: auto;

		.tutorial-buttons {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			width: 95%;
		}

		.btn-group {
			display: flex;
			margin: 0 auto;
		}
		.btn-tutorial {
			padding: 0 1em;
		}
	}

	.info-icon {
		position: absolute;
		right: 10px;
		bottom: 10px;
		height: 40px;
	}
}
</style>